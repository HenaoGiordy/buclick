package com.univalle.bubackend.services.nursing;

import com.univalle.bubackend.DTOs.nursing.ActivityLogRequest;
import com.univalle.bubackend.DTOs.nursing.ActivityLogResponse;
import com.univalle.bubackend.DTOs.nursing.ActivityNursingResponse;
import com.univalle.bubackend.DTOs.nursing.UserResponse;

import java.time.LocalDate;
import java.util.List;

public interface INursingActivityLog {

    UserResponse findUserByUsername(String username);

    ActivityLogResponse registerActivity(ActivityLogRequest request);

    List<ActivityNursingResponse> activitiesNursing(String username, LocalDate startDate, LocalDate endDate);

    ActivityNursingResponse getActivityNursing(Integer id);

}
