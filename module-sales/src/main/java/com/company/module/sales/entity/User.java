package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_user",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"USER_ID"})
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class User extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "USER_ID", length = 50, nullable = false, unique = true)
    private String userId;

    @Column(name = "USER_NAME", length = 100, nullable = false)
    private String userName;

    @Column(name = "PASSWORD", length = 200, nullable = false)
    private String password;

    @Column(name = "EMAIL", length = 200)
    private String email;

    @Column(name = "DEPARTMENT", length = 100)
    private String department;

    @Column(name = "ROLE", length = 20, nullable = false)
    @Builder.Default
    private String role = "USER";

    @Column(name = "IS_ACTIVE")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "LAST_LOGIN_AT")
    private LocalDateTime lastLoginAt;

}
