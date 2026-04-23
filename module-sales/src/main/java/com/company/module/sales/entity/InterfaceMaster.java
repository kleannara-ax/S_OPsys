package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_interface_master",
       indexes = {
           @Index(name = "idx_if_master_if_id", columnList = "INTERFACE_ID")
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class InterfaceMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "INTERFACE_ID", length = 30, nullable = false, unique = true)
    private String interfaceId;

    @Column(name = "INTERFACE_NAME", length = 200, nullable = false)
    private String interfaceName;

    @Column(name = "SENDER", length = 50)
    private String sender;

    @Column(name = "RECEIVER", length = 50)
    private String receiver;

    @Column(name = "RFC_URL", length = 500)
    private String rfcUrl;

    @Column(name = "RFC_PARAM", columnDefinition = "TEXT")
    private String rfcParam;

    @Column(name = "EXEC_COMMAND", columnDefinition = "TEXT")
    private String execCommand;

}
