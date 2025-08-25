package com.univalle.bubackend.services.setting;

import com.univalle.bubackend.DTOs.reservation.AvailabilityResponse;
import com.univalle.bubackend.DTOs.setting.SettingRequest;
import com.univalle.bubackend.DTOs.setting.SettingResponse;
import com.univalle.bubackend.exceptions.setting.InvalidTimeException;
import com.univalle.bubackend.exceptions.setting.SettingNotFound;
import com.univalle.bubackend.models.Setting;
import com.univalle.bubackend.repository.SettingRepository;
import com.univalle.bubackend.services.reservation.ReservationServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class SettingServiceImpl implements ISettingService {

    private SettingRepository settingRepository;
    private ReservationServiceImpl reservationService;

    @Override
    public SettingResponse createSetting(SettingRequest settingRequest) {

        exception(settingRequest);

        Setting setting = Setting.builder()
                .startSemester(settingRequest.startSemester())
                .endBeneficiaryLunch(settingRequest.endBeneficiaryLunch())
                .endBeneficiarySnack(settingRequest.endBeneficiarySnack())
                .endLunch(settingRequest.endLunch())
                .endSemester(settingRequest.endSemester())
                .endSnack(settingRequest.endSnack())
                .numLunch(settingRequest.numLunch())
                .numSnack(settingRequest.numSnack())
                .startBeneficiarySnack(settingRequest.starBeneficiarySnack())
                .startBeneficiaryLunch(settingRequest.starBeneficiaryLunch())
                .startLunch(settingRequest.starLunch())
                .startSnack(settingRequest.starSnack())
                .build();

        settingRepository.save(setting);

        // Obtener la disponibilidad actual después de crear el ajuste
        AvailabilityResponse availabilityResponse = reservationService.getAvailability();

        // Transmitir la disponibilidad actual a los clientes conectados
        reservationService.broadcastAvailability(availabilityResponse);

        return new SettingResponse(setting.getId(), "Ajustes creados exitosamente", settingRequest);
    }

    private void exception(SettingRequest settingRequest) {

        // ALMUERZOS
        if (settingRequest.endBeneficiaryLunch().isBefore(settingRequest.starBeneficiaryLunch()) ||
                settingRequest.endLunch().isBefore(settingRequest.starLunch())) {
            throw new InvalidTimeException("La hora de fin de almuerzo debe ser posterior a la hora de inicio de almuerzo");
        }

        if (settingRequest.starLunch().isBefore(settingRequest.starBeneficiaryLunch())) {
            throw new InvalidTimeException("La hora de inicio de almuerzo debe ser posterior a la hora de inicio para beneficiarios");
        }

        if (settingRequest.endLunch().isBefore(settingRequest.endBeneficiaryLunch())) {
            throw new InvalidTimeException("La hora de fin de almuerzo debe ser posterior a la hora de fin para beneficiarios");
        }

        // REFRIGERIOS

        if (settingRequest.endBeneficiarySnack().isBefore(settingRequest.starBeneficiarySnack()) ||
                settingRequest.endSnack().isBefore(settingRequest.starSnack())) {
            throw new InvalidTimeException("La hora de fin de refrigerio debe ser posterior a la hora de inicio de refrigerio");
        }

        if (settingRequest.starSnack().isBefore(settingRequest.starBeneficiarySnack())) {
            throw new InvalidTimeException("La hora de inicio de refrigerio debe ser posterior a la hora de inicio para beneficiarios");
        }

        if (settingRequest.endSnack().isBefore(settingRequest.endBeneficiarySnack())) {
            throw new InvalidTimeException("La hora de fin de refrigerio debe ser posterior a la hora de fin para beneficiarios");
        }

        // REFRIGERIO CON ALMUERZO

        if (settingRequest.starBeneficiarySnack().isBefore(settingRequest.endLunch()) ||
                settingRequest.starBeneficiarySnack().equals(settingRequest.endLunch())) {
            throw new InvalidTimeException("La hora de inicio de refrigerio debe ser posterior a la hora de fin de almuerzo.");
        }

    }

    @Override
    public List<SettingResponse> getSetting() {
        Optional<Setting> optionalSetting = settingRepository.findTopByOrderByIdAsc();

        if (optionalSetting.isPresent()) {
            Setting setting = optionalSetting.get();
            SettingRequest settingRequest = new SettingRequest(
                    setting.getId(),
                    setting.getStartSemester(),
                    setting.getEndSemester(),
                    setting.getNumLunch(),
                    setting.getNumSnack(),
                    setting.getStartBeneficiaryLunch(),
                    setting.getEndBeneficiaryLunch(),
                    setting.getStartLunch(),
                    setting.getEndLunch(),
                    setting.getStartBeneficiarySnack(),
                    setting.getEndBeneficiarySnack(),
                    setting.getStartSnack(),
                    setting.getEndSnack()
            );
            return List.of(new SettingResponse(setting.getId(), "Ajustes encontrado exitosamente", settingRequest));
        } else {
            return List.of();
        }

    }

    @Override
    public SettingResponse editSetting(SettingRequest settingRequest) {
        Setting setting = settingRepository.findTopByOrderByIdAsc()
                .orElseThrow(() -> new SettingNotFound("Ajuste no encontrado"));

        exception(settingRequest);

        setting.setStartSemester(settingRequest.startSemester());
            setting.setEndSemester(settingRequest.endSemester());
            setting.setNumLunch(settingRequest.numLunch());
            setting.setNumSnack(settingRequest.numSnack());
            setting.setStartBeneficiaryLunch(settingRequest.starBeneficiaryLunch());
            setting.setEndBeneficiaryLunch(settingRequest.endBeneficiaryLunch());
            setting.setStartLunch(settingRequest.starLunch());
            setting.setEndLunch(settingRequest.endLunch());
            setting.setStartBeneficiarySnack(settingRequest.starBeneficiarySnack());
            setting.setEndBeneficiarySnack(settingRequest.endBeneficiarySnack());
            setting.setStartSnack(settingRequest.starSnack());
            setting.setEndSnack(settingRequest.endSnack());

            settingRepository.save(setting);

            return new SettingResponse(setting.getId(), "Ajustes actualizados exitosamente", settingRequest);
        }
}
