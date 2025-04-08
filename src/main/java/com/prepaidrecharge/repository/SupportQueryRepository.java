package com.prepaidrecharge.repository;

import com.prepaidrecharge.model.SupportQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportQueryRepository extends JpaRepository<SupportQuery, Integer> {
    List<SupportQuery> findAllByOrderByQueryDateDesc();
}