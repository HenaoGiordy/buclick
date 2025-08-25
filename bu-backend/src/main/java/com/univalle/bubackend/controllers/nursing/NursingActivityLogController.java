package com.univalle.bubackend.controllers.nursing;

import com.univalle.bubackend.DTOs.nursing.ActivityLogRequest;
import com.univalle.bubackend.DTOs.nursing.ActivityLogResponse;
import com.univalle.bubackend.DTOs.nursing.ActivityNursingResponse;
import com.univalle.bubackend.DTOs.nursing.UserResponse;
import com.univalle.bubackend.services.nursing.NursingActivityLogImpl;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/nursing-activities")
@AllArgsConstructor
public class NursingActivityLogController {

    private NursingActivityLogImpl nursingActivityLog;

    @GetMapping("/search/{username}")
    public ResponseEntity<UserResponse> searchStudentsByCode(@PathVariable String username) {
        UserResponse response = nursingActivityLog.findUserByUsername(username);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PostMapping("/register")
    public ResponseEntity<ActivityLogResponse> registerActivity(@RequestBody ActivityLogRequest request) {
        ActivityLogResponse response = nursingActivityLog.registerActivity(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ActivityNursingResponse>> getActivities(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<ActivityNursingResponse> responses = nursingActivityLog.activitiesNursing(username, startDate, endDate);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }


    @GetMapping("/activity/{id}")
    public ResponseEntity<ActivityNursingResponse> getActivity(@PathVariable Integer id) {
        return new ResponseEntity<>(nursingActivityLog.getActivityNursing(id), HttpStatus.OK);
    }

}
