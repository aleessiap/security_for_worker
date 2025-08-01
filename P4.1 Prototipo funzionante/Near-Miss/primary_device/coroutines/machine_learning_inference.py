from lib.primitives.queue import Queue
import uasyncio
import time
import lib.model as random_forest


async def processor_coro(
        processables: list,
        outgoing_mqtt_queue:Queue,
        my_id: str 
        ):
    print("processor_coro: Inside processor coro. Waiting for an input")
    
    desired_order = ['GyroX', 'GyroY', 'GyroZ',
                    'AccX', 'AccY', 'AccZ', 'AccMag',
                    'AngX', 'AngY', 'AngZ', 'AngMag']

    # Dictionary to map device names to their order
    # This is a fallback mechanism to ensure that if a device name is not found,
    # it will be assigned a high value (999) so it appears at the end of the sorted list.
    order_map = {}
    for i in range(len(desired_order)):
        order_map[desired_order[i]] = i
    print("processor_coro: Order map created")
    print("Order map:", order_map)   
 
    # Function to get the order of a sensor based on its raw_device_name
    # If the name is a tuple, it takes the first element.
    def get_order(sensor):
        name = sensor.raw_device_name
        if isinstance(name, tuple):
            name = name[0]
        return order_map.get(name, 999) 
    
    # Sort the processables list
    processables.sort(key=get_order)
    
    print("processor_coro: Processables sorted by raw_device_name")
    await uasyncio.sleep_ms(5000)
    print("processor_coro: Starting main loop")
    while True:
        await uasyncio.sleep_ms(1000)
        if processables != []:
            input_array = []
            
            # Collect statistics from each processable and build the input array
            for p in processables:
                input_array.extend(p.get_statistics())

            if input_array != []:
                # Pass the input array to the model for prediction
                pred = random_forest.predict(input_array)
                # Debugging output
                if pred != 1 and pred != 0:
                    print("processor_coro: error in label")
                    continue
                # If the prediction is 1, it indicates a near miss
                if pred == 1:
                    print("processor_coro: Near Miss detected")
                    await outgoing_mqtt_queue.put({
                        "eventType": "near_miss",
                        "timestamp": time.time(),
                        "sensorId": my_id
                    })
            