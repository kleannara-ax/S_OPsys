package com.company.module.sales.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DevScheduleDto {

    @NotNull(message = "일정 날짜는 필수입니다")
    private LocalDate scheduleDate;

    private LocalTime scheduleTime;

    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 500)
    private String title;

    @Size(max = 2000)
    private String description;

    @Size(max = 100)
    private String category;

    @Size(max = 50)
    private String status;

    @Size(max = 20)
    private String priority;

    @Size(max = 200)
    private String assignee;

    private Integer progress;

    @Size(max = 2000)
    private String notes;
}
