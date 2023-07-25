package com.inet.juchamsi.domain.villa.entity;

import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import static javax.persistence.EnumType.STRING;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Getter
public class Villa extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column()
    private Long id;

    @Setter
    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(name = "id_number", nullable = false, length = 15)
    private String idNumber;

    @Column(name = "total_count", nullable = false)
    private int totalCount;

    @Setter
    @Enumerated(STRING)
    @Column(nullable = false, length = 6)
    private Active active;


    public  Villa() {}

    @Builder
    public Villa(Long id, String name, String address, String idNumber, int totalCount, Active active) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.idNumber = idNumber;
        this.totalCount = totalCount;
        this.active = active;
    }
}