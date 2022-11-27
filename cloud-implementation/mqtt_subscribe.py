import random
import mysql.connector
from paho.mqtt import client as mqtt_client
from sshtunnel import SSHTunnelForwarder
from mysql.connector import Error

broker = '20.196.216.210'
port = 1884
top_res = "srv/rescue"
client_id = f'python-mqtt-{random.randint(0, 1000)}'

def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)
    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client, database):
    def on_message(client, userdata, msg):
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
    client.subscribe(top_res)
    client.on_message = on_message


# SQL part stars here

def connect_mysql(host, user, password, db):
    dbconn = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=db
    )
    print('Connection to the database established')
    return dbconn


def disconnect_db(connection):
    if connection.is_connected():
        connection.close()
        print("MySQL connection is closed")


def addMessage(connection, message):
    try:
        cursor = connection.cursor()
        listmain = message.split(":")
        sqlSTR = 'INSERT INTO messages (nodeId, severity, latitude, longitude) VALUES (%s, %s, %s, %s)'
        values = (int(listmain[0]), listmain[1], listmain[2], listmain[3])
        cursor.execute(sqlSTR, values)
        connection.commit()
        print(cursor.rowcount, "Message added into the database")
        cursor.close()
    except mysql.connector.Error as error:
        print("Fail to add values".format(error))
# SQL part ends here

def run():
    dbconn = connect_mysql('20.196.216.210', 'iotTest', 'SQL_iot_123', 'rescue')
    client = connect_mqtt()
    message = subscribe(client, dbconn)
    addMessage(dbconn, message)
    client.loop_forever()

run()
