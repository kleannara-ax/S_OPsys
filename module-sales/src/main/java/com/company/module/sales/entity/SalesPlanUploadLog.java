package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_plan_upload_log")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class SalesPlanUploadLog extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "UPLOAD_TYPE", length = 50)
    private String uploadType;

    @Column(name = "FILE_NAME", length = 500)
    private String fileName;

    @Column(name = "RECORD_COUNT")
    private Integer recordCount;

    @Column(name = "CHECKSUM", length = 128)
    private String checksum;

    @Column(name = "FILE_SIZE")
    private Long fileSize;

    @Column(name = "ROW_COUNT")
    private Integer rowCount;

    @Column(name = "PROCESSED_COUNT")
    private Integer processedCount;

    @Column(name = "MERGED_ROWS")
    private Integer mergedRows;

    @Column(name = "STATUS", length = 50)
    private String status;

    @Column(name = "MESSAGE", length = 1000)
    private String message;

    @Column(name = "UPLOADED_BY", length = 100)
    private String uploadedBy;

}
