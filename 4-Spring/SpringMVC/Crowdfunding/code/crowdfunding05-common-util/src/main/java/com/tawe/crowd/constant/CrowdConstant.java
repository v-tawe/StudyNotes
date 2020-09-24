package com.tawe.crowd.constant;

/**
 * @ClassName CrowdConstant
 * @Description 常量字段
 * @Author Administrator
 * @Date 9/24/2020 5:58 PM
 * @Version 1.0
 **/
public enum CrowdConstant {
    /**
     * 常量字段
     */
    ATTR_NAME_EXCEPTION("exception"),
    MESSAGE_LOGIN_FAILED("登录失败! 请确认账号密码是否正确!")
    ;

    public final String str;
    CrowdConstant(String str) {
        this.str = str;
    }

    @Override
    public String toString() {
        return this.str;
    }
}
