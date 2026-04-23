package com.company.module.sales.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterfaceExecutionDto {

    @NotBlank(message = "인터페이스 ID는 필수입니다")
    @Size(max = 30)
    private String interfaceId;

    @Size(max = 200)
    private String interfaceName;

    @NotBlank(message = "스케줄 타입은 필수입니다")
    @Size(max = 20)
    private String scheduleType;

    @Size(max = 10)
    private String executionTime;

    private Integer intervalMinutes;

    @Size(max = 100)
    private String cronExpression;

    private Boolean isActive;

    @Size(max = 500)
    private String description;
}
