package com.qt.controller;

import com.alibaba.fastjson.JSONPObject;
import com.qt.entity.Book;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by defore on 16/5/9.
 */
@Controller
@RequestMapping(value="test")
public class TestController {
    @RequestMapping(value="getJSON.do")
    @ResponseBody
    public JSONPObject getJSON() {
        JSONPObject jsonObj = new JSONPObject();
        Book book1 = new Book();
        Book book2 = new Book();
        book1.setId(1);
        book1.setBookname("中文s");
        book1.setPublisher("中文出版社ss");
        book2.setId(2);
        book2.setBookname("英文s");
        book2.setPublisher("英文出版社cc");
        List<Book> list = new ArrayList<Book>();
        list.add(book1);
        list.add(book2);
        jsonObj.addParameter(list);
        return jsonObj;
    }
    @RequestMapping(value="get.do")
    @ResponseBody
    public List<Book> getMap () {
        Book book1 = new Book();
        Book book2 = new Book();
        book1.setId(1);
        book1.setBookname("中文s");
        book1.setPublisher("中文出版社ss");
        book2.setId(2);
        book2.setBookname("英文s");
        book2.setPublisher("英文出版社cc");
        List<Book> list = new ArrayList<Book>();
        list.add(book1);
        list.add(book2);
        return list;
    }
}
