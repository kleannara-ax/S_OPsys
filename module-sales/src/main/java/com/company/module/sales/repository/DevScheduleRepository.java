package com.company.module.sales.repository;

import com.company.module.sales.entity.DevSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DevScheduleRepository extends JpaRepository<DevSchedule, Long> {

    List<DevSchedule> findByScheduleDateBetweenOrderByScheduleDateAscScheduleTimeAsc(
            LocalDate startDate, LocalDate endDate);

    List<DevSchedule> findByStatusOrderByScheduleDateAscScheduleTimeAsc(String status);

    List<DevSchedule> findByCategoryOrderByScheduleDateAscScheduleTimeAsc(String category);

    List<DevSchedule> findAllByOrderByScheduleDateDescScheduleTimeDesc();
}
