package com.ssrm.geo.controller;

import com.ssrm.geo.beans.Schedule;
import com.ssrm.geo.db.MysqlConnect;

import java.io.BufferedReader;
import java.sql.*;
import java.sql.Date;
import java.time.format.DateTimeFormatter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.google.gson.Gson;


/**
 * Created by st540e on 8/3/2017.
 */
@Controller
@RequestMapping("/Schedule")
public class AddressRetrieveController {



    @Autowired
    MysqlConnect connection;

    @RequestMapping(value = "/retrieveNextSchedule/{teamName}", method = {
            RequestMethod.GET })
    @ResponseBody
    public Schedule retrieveNextSchedule(HttpServletRequest servletRequest, HttpServletResponse servletResponse, @PathVariable("teamName") String teamName) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        //LocalDate localDate = LocalDate.now();
        //System.out.println(dtf.format(localDate));

        Schedule schedule = new Schedule();
        String sql = "SELECT * FROM schedule WHERE Teamname=? AND operationDate = ? AND jobStatus IS NULL LIMIT 1";
        Connection conn = connection.connect();
        try {
            java.util.Date date = new java.util.Date();
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, teamName);
            stmt.setDate(2, new Date(date.getTime()));
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                schedule.setTeamName(rs.getString(1));
                schedule.setOperationDate(Date.valueOf(rs.getString(2)));
                schedule.setAddress(rs.getString(3));
                schedule.setMap(rs.getString(4));
                schedule.setInstructions(rs.getString(5));
                schedule.setStartTime(rs.getString(6));
                schedule.setEndTime(rs.getString(7));
                schedule.setJobStatus(rs.getString(8));
                schedule.setComments(rs.getString(9));
                schedule.setSerialNo(rs.getInt(10));
            }
            conn.close();
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
        } finally {
            connection.disconnect();
        }

        return schedule;
    }

    @RequestMapping(value= "/updateSchedule", method = {
            RequestMethod.GET, RequestMethod.POST })
    @ResponseBody
    public boolean updateSchedule(HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        int updatedRows = 0;
        String sql = "UPDATE schedule SET jobStatus =  ?, startTime = ?, endTime = ? WHERE Teamname=? AND operationDate = ? AND serialNo = ?";

        try {
            BufferedReader reader = servletRequest.getReader();
            Gson gson = new Gson();

            Schedule schedule = gson.fromJson(reader, Schedule.class);
            Connection conn = connection.connect();
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setString(1, schedule.getJobStatus());
            preparedStatement.setString(2, schedule.getStartTime());
            preparedStatement.setString(3, schedule.getEndTime());
            preparedStatement.setString(4, schedule.getTeamName());
            preparedStatement.setDate(5, new java.sql.Date(schedule.getOperationDate().getTime()));
            preparedStatement.setInt(6, schedule.getSerialNo());
            updatedRows = preparedStatement.executeUpdate();
            conn.close();

        } catch (Exception e) {
            //system.out.println("Exception " + e.getMessage());
        } finally {
            connection.disconnect();
            if (updatedRows == 1) {
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
