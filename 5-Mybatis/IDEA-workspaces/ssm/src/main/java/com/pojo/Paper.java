package com.pojo;

/**
 * @ClassName Paper
 * @Description TODO
 * @Author davidt
 * @Date 5/20/2020 5:46 PM
 * @Version 1.0
 **/
public class Paper {
    private long paperId;
    private String paperName;
    private int paperNum;
    private String paperDetail;

    public long getPaperId() {
        return paperId;
    }

    public void setPaperId(long paperId) {
        this.paperId = paperId;
    }

    public String getPaperName() {
        return paperName;
    }

    public void setPaperName(String paperName) {
        this.paperName = paperName;
    }

    public int getPaperNum() {
        return paperNum;
    }

    public void setPaperNum(int paperNum) {
        this.paperNum = paperNum;
    }

    public String getPaperDetail() {
        return paperDetail;
    }

    public void setPaperDetail(String paperDetail) {
        this.paperDetail = paperDetail;
    }
}
