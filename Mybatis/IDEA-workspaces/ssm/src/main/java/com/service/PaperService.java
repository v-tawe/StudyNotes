package com.service;

import com.pojo.Paper;

import java.util.List;

/**
 * @ClassName PaperService
 * @Description TODO
 * @Author davidt
 * @Date 5/20/2020 5:47 PM
 * @Version 1.0
 **/
public interface PaperService {
    int addPaper(Paper paper);
    int deletePaperById(long id);
    int updatePaper(Paper paper);

    Paper queryById(long id);
    List<Paper> queryAllPaper();
}
