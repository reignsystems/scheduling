package com.ssrm.geo.db;

/**
 * Created by st540e on 8/16/2017.
 */
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

@Component
public class MysqlConnect {
    // init database constants
    private static final String DATABASE_DRIVER = "com.mysql.jdbc.Driver";
    //Server Configurations
    private static final String DATABASE_URL = "jdbc:mysql://bestmow.db.9668947.8d4.hostedresource.net:3306/bestmow?autoReconnect=false&useSSL=false";
    private static final String USERNAME = "bestmow";
    private static final String PASSWORD = "Technikons1!";

    //Local Configurations...
    /*private static final String DATABASE_URL = "jdbc:mysql://localhost:3306/mow?autoReconnect=false&useSSL=false";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "Aryan)#)%";*/

    private static final String MAX_POOL = "250";

    // init connection object
    private Connection connection;
    // init properties object
    private Properties properties;

    // create properties
    private Properties getProperties() {
        if (properties == null) {
            properties = new Properties();
            properties.setProperty("user", USERNAME);
            properties.setProperty("password", PASSWORD);
            properties.setProperty("MaxPooledStatements", MAX_POOL);
        }
        return properties;
    }

    // connect database
    public Connection connect() {
        if (connection == null) {
            try {
                Class.forName(DATABASE_DRIVER);
                connection = DriverManager.getConnection(DATABASE_URL, getProperties());
            } catch (SQLException e) {
                e.printStackTrace();
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
        return connection;
    }

    // disconnect database
    public void disconnect() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}