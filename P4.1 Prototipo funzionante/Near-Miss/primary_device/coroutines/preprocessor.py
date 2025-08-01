import time
import uasyncio
from lib.windowedCircularBuffer import WindowedCircularBuffer
from lib.Sensor_dimension import SensorDimension
from lib.primitives.queue import Queue

class ProcessableEntity:
    """Abstract class for a processable entity.

    A processable entity is composed of one or more raw devices, and has at least one
    method to trigger the preprocessing of the raw data.
    """
    def __init__(self, raw_devices: list[SensorDimension]):
        self.raw_devices = raw_devices
        self.raw_device_names = [d.get_name() for d in self.raw_devices]
    
    # abstract method
    def trigger_preprocessing(self):
        """Trigger the preprocessing of the raw data."""
        pass

class Sensor(ProcessableEntity):
    """Class for the Sensor object.
    
    The object is composed of one raw device only (the SensorDimension object
    corresponding to the sensor device). 

    The preprocessing is done as follows:
    - the average value of the last time window is computed
    - the std of the windowed data is computed
    - the max of the windowed data is computed
    - the min of the windowed data is computed
    - the range of the windowed data is computed
    - the derivative of the windowed data is computed
    """
    def __init__(self, raw_device: SensorDimension):
        # List of raw devices
        self.raw_device = raw_device
        # List of raw devices names
        self.raw_device_name =  self.raw_device.get_name()
        
        self.average=None
        self.std=None   
        self.max=None
        self.min=None
        self.range=None
        self.derivative=None

    def get_statistics(self):
        """Returns the statistics of the sensor."""
        return [self.average, self.std, self.max, self.min, self.range, self.derivative] 
    

    def trigger_preprocessing(self, data):

        """Trigger the preprocessing of the raw data."""
        self.raw_device.update_value(data, time.ticks_ms())

        self.average=self.raw_device.get_avg()
        self.std=self.raw_device.get_std()   
        self.max=self.raw_device.get_max()
        self.min=self.raw_device.get_min() 
        self.range=self.raw_device.get_range()
        self.derivative=self.raw_device.get_derivative()   


# Coroutine to preprocess the data from the sensors
# It waits for data from the preprocessor queue and updates the processables list
# The processables list is a list of Sensor objects, each representing a sensor device
# The preprocessing is done by calling the trigger_preprocessing method of each Sensor object
# The results are stored in the Sensor object, which can be accessed later for further processing
async def preprocessor_coro(
    data_to_process: list[SensorDimension], 
    preprocessor_queue: Queue,
    processables: list
    ):

    # Initialize the useful data structures
    for sensor in data_to_process:
        sensor_to_process = Sensor(sensor)
        processables.append(sensor_to_process)

    print("preprocessor_coro: Preprocessor started")

    while True:
        result = await preprocessor_queue.get()
        #print("preprocessor_coro: Received data to process:", result)
        # Trigger the preprocessing for the processable entities that have the device with the given name
        for p in processables:   
            if p.raw_device_name in result:
                p.trigger_preprocessing(result[p.raw_device_name])
        # Trigger the preprocessing for the processable entities that have the AccMag or AngMag device
        # This is done to compute the magnitude of the acceleration and angular velocity
        for p in processables:
            if p.raw_device_name == 'AccMag':
                p.trigger_preprocessing(result['AccX']**2 + result['AccY']**2 + result['AccZ']**2)
            if p.raw_device_name == 'AngMag':
                p.trigger_preprocessing(result['AngX']**2 + result['AngY']**2 + result['AngZ']**2)
        
        
        