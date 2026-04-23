package com.company.module.sales.dto;

import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesChannelDto {

    @Size(max = 50)
    private String channelKey;

    @Size(max = 100)
    private String channelName;

    @Size(max = 500)
    private String description;
}
