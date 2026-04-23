package com.company.module.sales.service;

import com.company.module.sales.entity.InterfaceHistory;
import com.company.module.sales.entity.InterfaceMaster;
import com.company.module.sales.repository.InterfaceHistoryRepository;
import com.company.module.sales.repository.InterfaceMasterRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InterfaceHistoryService {

    private final InterfaceHistoryRepository repository;
    private final InterfaceMasterRepository masterRepo;
    private final InterfaceSchedulerService schedulerService;

    @Transactional(readOnly = true)
    public Page<InterfaceHistory> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<InterfaceHistory> findAllSorted() {
        return repository.findAllByOrderByStartTimeDesc();
    }

    @Transactional(readOnly = true)
    public List<InterfaceHistory> findByInterfaceId(String interfaceId) {
        return repository.findByInterfaceIdOrderByStartTimeDesc(interfaceId);
    }

    @Transactional(readOnly = true)
    public List<InterfaceHistory> findErrors() {
        return repository.findByStatusInOrderByStartTimeDesc(List.of("ERROR", "RETRY_ERROR"));
    }

    @Transactional(readOnly = true)
    public List<InterfaceHistory> findLatestPerInterface() {
        return repository.findLatestPerInterface();
    }

    public InterfaceHistory executeManually(String interfaceId) {
        Optional<InterfaceMaster> optMaster = masterRepo.findByInterfaceId(interfaceId);
        if (optMaster.isEmpty()) {
            throw new EntityNotFoundException("인터페이스 마스터를 찾을 수 없습니다: " + interfaceId);
        }
        InterfaceMaster master = optMaster.get();
        String execCommand = master.getExecCommand();
        if (execCommand != null && !execCommand.trim().isEmpty()) {
            return schedulerService.executeInterface(
                    interfaceId, master.getInterfaceName(), execCommand, "MANUAL", null);
        }
        String rfcUrl = master.getRfcUrl();
        if (rfcUrl != null && !rfcUrl.trim().isEmpty()) {
            return schedulerService.executeViaRfcUrl(
                    interfaceId, master.getInterfaceName(), rfcUrl, master.getRfcParam(), "MANUAL", null);
        }
        throw new IllegalStateException("실행 명령어 또는 RFC URL이 등록되지 않았습니다: " + interfaceId);
    }

    public InterfaceHistory retry(Long historyId) {
        InterfaceHistory original = repository.findById(historyId)
                .orElseThrow(() -> new EntityNotFoundException("이력을 찾을 수 없습니다: " + historyId));
        Optional<InterfaceMaster> optMaster = masterRepo.findByInterfaceId(original.getInterfaceId());
        if (optMaster.isEmpty()) {
            throw new EntityNotFoundException("인터페이스 마스터를 찾을 수 없습니다: " + original.getInterfaceId());
        }
        InterfaceMaster master = optMaster.get();
        String execCommand = master.getExecCommand();
        if (execCommand != null && !execCommand.trim().isEmpty()) {
            return schedulerService.executeInterface(
                    original.getInterfaceId(), master.getInterfaceName(), execCommand, "RETRY", historyId);
        }
        String rfcUrl = master.getRfcUrl();
        if (rfcUrl != null && !rfcUrl.trim().isEmpty()) {
            return schedulerService.executeViaRfcUrl(
                    original.getInterfaceId(), master.getInterfaceName(), rfcUrl, master.getRfcParam(), "RETRY", historyId);
        }
        throw new IllegalStateException("실행 명령어 또는 RFC URL이 등록되지 않았습니다.");
    }
}
