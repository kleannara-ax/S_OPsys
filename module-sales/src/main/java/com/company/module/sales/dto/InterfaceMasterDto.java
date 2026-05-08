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
public class InterfaceMasterDto {

    @NotBlank(message = "인터페이스 ID는 필수입니다")
    @Size(max = 30)
    private String interfaceId;

    @NotBlank(message = "인터페이스명은 필수입니다")
    @Size(max = 200)
    private String interfaceName;

    @Size(max = 50)
    private String sender;

    @Size(max = 50)
    private String receiver;

    @Size(max = 500)
    private String rfcUrl;

    private String rfcParam;

    private String execCommand;
}
