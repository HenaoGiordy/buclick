package com.univalle.bubackend.DTOs.report;

import java.util.List;

public record ReportRequest(String semester,
                            String beca,
                            List<UserDTO> users) {
}
