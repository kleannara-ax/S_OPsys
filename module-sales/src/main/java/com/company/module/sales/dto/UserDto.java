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
public class UserDto {

    @NotBlank(message = "사용자 ID는 필수입니다")
    @Size(max = 50)
    private String userId;

    @NotBlank(message = "사용자명은 필수입니다")
    @Size(max = 100)
    private String userName;

    @Size(max = 200)
    private String password;

    @Size(max = 200)
    private String email;

    @Size(max = 100)
    private String department;

    @Size(max = 20)
    private String role;

    private Boolean isActive;
}
