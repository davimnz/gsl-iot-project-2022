import random

import mysql.connector
from paho.mqtt import client as mqtt_client
from sshtunnel import SSHTunnelForwarder
from mysql.connector import Error


broker = '20.196.216.210'
port = 1884
topic = "srv/rescue"
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
        add_message(database, msg.payload.decode())
    client.subscribe(topic, qos=2)
    client.on_message = on_message

    
################################ SQL part starts here

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


        
def add_message(database, message):
    try:
        cursor = database.cursor()
        sql = "INSERT INTO messages (nodeId, severity, latitude, longitude) VALUES ('%s', '%s', '%s', '%s')"
        #values = (int(listNode[0]), listNode[1], float(listNode[2]), float(listNode[3]))
        values = (15, 'High', 19.3473711, -99.1303977) # Test to see if it inserts the values
        cursor.execute(sql, values)
        database.commit()
        print(cursor.rowcount, "Message added into the database")
        
    except mysql.connector.Error as error:
        print("Fail to add values".format(error))

        
########################################################### SQL part ends here

def run():
    rescue = connect_mysql('20.196.216.210', 'iotTest', 'SQL_iot_123', 'rescue')
    client = connect_mqtt()
    message = subscribe(client, rescue)
    client.loop_forever()

run()
