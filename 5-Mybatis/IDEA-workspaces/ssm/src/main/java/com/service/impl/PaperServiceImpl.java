package com.service.impl;

import com.dao.PaperDao;
import com.pojo.Paper;
import com.service.PaperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @ClassName PaperServiceImpl
 * @Description TODO
 * @Author davidt
 * @Date 5/20/2020 5:49 PM
 * @Version 1.0
 **/
@Service
public class PaperServiceImpl implements PaperService {

    private final PaperDao paperDao;

    public PaperServiceImpl(PaperDao paperDao) {
        this.paperDao = paperDao;
    }

    @Override
    public int addPaper(Paper paper) {
        return paperDao.addPaper(paper);
    }

    @Override
    public int deletePaperById(long id) {
        return paperDao.deletePaperById(id);
    }

    @Override
    public int updatePaper(Paper paper) {
        return paperDao.updatePaper(paper);
    }

    @Override
    public Paper queryById(long id) {
        return paperDao.queryById(id);
    }

    @Override
    public List<Paper> queryAllPaper() {
        return paperDao.queryAllPaper();
    }
}
