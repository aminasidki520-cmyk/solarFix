package com.example.demo.repository.anomaly;
import com.example.demo.entity.anomaly.Anomaly;
import com.example.demo.entity.anomaly.Severity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

import java.util.List;

@Repository
public interface AnomalyRepository  extends JpaRepository<Anomaly, Long> {
    List<Anomaly> findBySeverity(Severity severity);
    List<Anomaly> findByProcessedFalse();
    List<Anomaly> findByStartAtGreaterThanEqualAndEndAtLessThanEqual(LocalDateTime start, LocalDateTime end);
}
