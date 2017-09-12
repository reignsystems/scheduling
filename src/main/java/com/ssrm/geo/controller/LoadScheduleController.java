package com.ssrm.geo.controller;

/**
 * Created by st540e on 9/10/2017.
 */

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import com.ssrm.geo.db.MysqlConnect;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/")
public class LoadScheduleController {


    @Autowired
    MysqlConnect connection;

    @RequestMapping(value = "/loadSchedule", method = {
            RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public boolean loadSchedule(HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        Connection conn = getConnection().connect();
        int[] rowsInserted = null;
        try {
            conn.setAutoCommit(false);
            PreparedStatement preparedStatement = null;
            //FileInputStream input = new FileInputStream("C:\\Users\\st540e\\Downloads\\schedule.xlsx");
            //POIFSFileSystem fs = new POIFSFileSystem(input);
            Workbook workbook;
            workbook = WorkbookFactory.create(new File("C:\\Users\\st540e\\Downloads\\schedule.xlsx"));
            Sheet sheet = workbook.getSheetAt(0);
            Row row;
            String compiledQuery = "INSERT INTO schedule(Teamname, operationDate, streetAddress, map, instructions, startTime, endTime, jobStatus, comments, serialNo)" +
                    " VALUES" + "(?, ?, ?, ?, ?,?,?,?,?,?)";
            preparedStatement = conn.prepareStatement(compiledQuery);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                row = (Row) sheet.getRow(i);
                preparedStatement.setString(1, row.getCell(1).getStringCellValue());
                preparedStatement.setDate(2, new java.sql.Date(row.getCell(2).getDateCellValue().getTime()));
                preparedStatement.setString(3, row.getCell(4).getStringCellValue());
                preparedStatement.setString(4, row.getCell(5).getStringCellValue());
                preparedStatement.setString(5, row.getCell(8).getStringCellValue());
                preparedStatement.setString(6, row.getCell(3).getStringCellValue());
                preparedStatement.setString(7, row.getCell(9).getStringCellValue());
                preparedStatement.setString(8, null);
                preparedStatement.setString(9, row.getCell(7).getStringCellValue());
                preparedStatement.setInt(10, (int)row.getCell(0).getNumericCellValue());
                preparedStatement.addBatch();
                System.out.println("Import rows " + i);
            }
            rowsInserted = preparedStatement.executeBatch();
            conn.commit();
            preparedStatement.close();
            System.out.println("Success import excel to mysql table");
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
        } finally {
            connection.disconnect();
            if (rowsInserted != null && rowsInserted.length > 0) {
                return true;
            }
        }
        return false;

    }


    public MysqlConnect getConnection() {
        return connection;
    }

    public void setConnection(MysqlConnect connection) {
        this.connection = connection;
    }

}

