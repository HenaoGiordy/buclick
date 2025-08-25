package com.univalle.bubackend.services.odontology;

import com.univalle.bubackend.DTOs.odontology.*;
import com.univalle.bubackend.DTOs.user.UserRequest;
import com.univalle.bubackend.exceptions.ResourceNotFoundException;
import com.univalle.bubackend.exceptions.nursing.FieldException;
import com.univalle.bubackend.models.UserEntity;
import com.univalle.bubackend.models.VisitOdontologyLog;
import com.univalle.bubackend.repository.OdontologyVisitRepository;
import com.univalle.bubackend.repository.UserEntityRepository;
import com.univalle.bubackend.services.user.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
@Transactional
public class OdontologyVisitLogImpl implements IOdontologyVisitLog {

    private final UserEntityRepository userEntityRepository;
    private final OdontologyVisitRepository odontologyVisitRepository;
    private final UserServiceImpl userService;

    @Override
    public UserResponse findStudentsByUsername(String username) {
        Optional<UserEntity> optionalUser = userEntityRepository.findByUsername(username);
        UserEntity user = optionalUser.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return new UserResponse(user);
    }

    @Override
    public VisitLogResponse registerVisit(VisitLogRequest request) {
        Optional<UserEntity> userCondition = userEntityRepository.findByUsername(request.username());

        if (userCondition.isEmpty()) {
            Set<String> roles = Set.of("EXTERNO");
            UserRequest userRequest = new UserRequest(
                    request.username(),
                    request.name(),
                    request.lastname(),
                    null,
                    null,
                    request.plan(),
                    roles,
                    null
            );
            userService.createUser(userRequest);

        }


        UserEntity user = userEntityRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        VisitOdontologyLog visitOdontologyLog = VisitOdontologyLog.builder()
                .user(user)
                .date(request.date().atStartOfDay())
                .reason(request.reason())
                .description(request.description())
                .build();

        odontologyVisitRepository.save(visitOdontologyLog);

        return new VisitLogResponse(
                visitOdontologyLog.getId(),
                visitOdontologyLog.getDate().toLocalDate(),
                visitOdontologyLog.getDate().toLocalTime(),
                user.getUsername(),
                user.getName(),
                user.getLastName(),
                user.getPlan(),
                visitOdontologyLog.getReason(),
                visitOdontologyLog.getDescription()
        );
    }

    @Override
    public VisitOdontologyResponse visitsOdonotology(String username, LocalDate startDate, LocalDate endDate, Pageable pageable) {

        if (username == null && (startDate == null || endDate == null)) {
            throw new FieldException("Debe suministrar el nombre de usuario o el rango de fechas para realizar la búsqueda");
        }

        UserResponse user = new UserResponse(null, null, null, null, null);
        Page<VisitOdontologyLog> visitResponses;

        // Si ambos están presentes, filtrar por username y fecha
        if (username != null && startDate != null && endDate != null) {
            UserEntity usr = userEntityRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            user = new UserResponse(usr);

            visitResponses = odontologyVisitRepository.findAllByUserUsernameAndDateBetween(
                    username, startDate.atStartOfDay(), endDate.atTime(LocalTime.MIDNIGHT), pageable);

            // Solo por username
        } else if (username != null) {
            UserEntity usr = userEntityRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            user = new UserResponse(usr);
            visitResponses = odontologyVisitRepository.findAllByUserUsername(username, pageable);

            // Solo por rango de fechas
        } else {
            visitResponses = odontologyVisitRepository.findAllByDateBetween(
                    startDate.atStartOfDay(), endDate.atTime(LocalTime.MIDNIGHT), pageable);
        }

        UserResponse finalUser = user;
        visitResponses
                .map(visit -> new VisitResponse(
                        visit.getDate(),
                        finalUser.name(),
                        finalUser.lastName(),
                        finalUser.username(),
                        finalUser.plan(),
                        visit.getReason(),
                        visit.getDescription()
                ));

        return new VisitOdontologyResponse(visitResponses, user);
    }

    @Override
    public VisitResponse getOdontologyVisit(Long id) {
        VisitOdontologyLog visit = odontologyVisitRepository.findById(id);
        UserResponse user = new UserResponse(visit.getUser());
        return new VisitResponse(
                visit.getDate(),
                user.name(),
                user.lastName(),
                user.username(),
                user.plan(),
                visit.getReason(),
                visit.getDescription()
        );
    }

    @Override
    public ByteArrayInputStream downloadOdontologyReport() {
        // Calcular el rango de fechas para el último año
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusYears(1);

        // Obtener las visitas de odontología dentro del último año
        List<VisitOdontologyLog> visitLogs = odontologyVisitRepository.findAllWithinLastYear(startDate, endDate);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Reporte de Odontología");

            // Crear estilos
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle normalStyle = workbook.createCellStyle();
            Font normalFont = workbook.createFont();
            normalFont.setFontHeightInPoints((short) 12);
            normalStyle.setFont(normalFont);

            // Encabezado de la tabla
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Fecha", "Codigo/CC", "Nombre", "Apellido", "Plan", "Motivo", "Descripción"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Llenar datos
            int rowNum = 1;
            for (VisitOdontologyLog visit : visitLogs) {
                Row row = sheet.createRow(rowNum++);

                // Fecha (formato legible)
                row.createCell(0).setCellValue(visit.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

                // Datos del usuario
                row.createCell(1).setCellValue(visit.getUser().getUsername());
                row.createCell(2).setCellValue(visit.getUser().getName());
                row.createCell(3).setCellValue(visit.getUser().getLastName());
                row.createCell(4).setCellValue(visit.getUser().getPlan());

                // Motivo (formateado)
                String formattedReason = visit.getReason()
                        .toString()
                        .toLowerCase()
                        .replace("_", " ");
                formattedReason = Character.toUpperCase(formattedReason.charAt(0)) + formattedReason.substring(1);
                row.createCell(5).setCellValue(formattedReason);

                // Descripción
                row.createCell(6).setCellValue(visit.getDescription());
            }

            // Ajustar ancho de columnas automáticamente
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Escribir el archivo Excel
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error al generar el archivo Excel", e);
        }
    }


}
