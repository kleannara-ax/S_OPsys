package com.company.module.sales.service;

import com.company.module.sales.dto.SalesChannelDto;
import com.company.module.sales.entity.SalesChannel;
import com.company.module.sales.repository.SalesChannelRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class SalesChannelService {

    private final SalesChannelRepository repository;

    @Transactional(readOnly = true)
    public Page<SalesChannel> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public SalesChannel findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("판매채널을 찾을 수 없습니다: " + id));
    }


    @Transactional
    public SalesChannel create(SalesChannelDto dto) {
        SalesChannel entity = SalesChannel.builder()
                .channelKey(dto.getChannelKey())
                .channelName(dto.getChannelName())
                .description(dto.getDescription())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public SalesChannel update(Long id, SalesChannelDto dto) {
        SalesChannel existing = findById(id);
        if (dto.getChannelKey() != null) existing.setChannelKey(dto.getChannelKey());
        if (dto.getChannelName() != null) existing.setChannelName(dto.getChannelName());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("판매채널을 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
