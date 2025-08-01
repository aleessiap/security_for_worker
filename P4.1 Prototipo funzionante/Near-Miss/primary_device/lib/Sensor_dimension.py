
from lib.windowedCircularBuffer import WindowedCircularBuffer
import math

# Class representing a sensor dimension with a circular buffer for data storage
# It allows updating values, retrieving statistics, and managing the buffer
# The buffer length and window size can be specified during initialization
class SensorDimension:
    def __init__(self, name: str,  buf_len = 30, buf_window_s = 2):
        self._name = name
        self._buffer = WindowedCircularBuffer(buf_len, buf_window_s)
        
    # Function to update the value in the buffer
    # It appends the value with the current timestamp to the buffer
    # The timestamp is used to manage the circular buffer and ensure data is within the specified window
    # The value is appended to the buffer, which manages the circular nature of the data storage
    def update_value(self, value: float, timestamp: int):
        self._buffer.append(value, timestamp)

    # Function to get the name of the sensor dimension
    # Returns the name of the sensor dimension
    # This is used to identify the sensor in the system
    def get_name(self) -> str:
        """Returns the sensor dimension."""
        return self._name
    
    # Function to get the average value in the buffer
    # If the buffer is empty, it returns None
    # The average is calculated from the values in the current window of the buffer
    # Returns the average value of the values in the buffer
    def get_avg(self):
        return self._buffer.get_window_mean()

    # Function to get the count of elements in the buffer
    # Returns the number of elements in the current window of the buffer
    # If the buffer is empty, it returns 0
    # The count is calculated from the values in the current window of the buffer
    def get_count(self):
        return self._buffer.get_window_count()
    
    # Function to get the length of the buffer
    # Returns the number of elements in the buffer
    # If the buffer is empty, it returns 0
    # The length is calculated from the values in the current window of the buffer
    def get_buffer_len(self):
        return len(self._buffer)
    
    #  Function to get the standard deviation of the values in the buffer
    # If the buffer is empty, it returns None
    # The standard deviation is calculated from the values in the current window of the buffer
    # Returns the standard deviation of the values in the buffer
    def get_std(self):
        std, _ = self._buffer.get_window_std_dev()
        return std

    # Function to get the minimum value in the buffer
    # If the buffer is empty, it returns None
    # The minimum value is calculated from the values in the current window of the buffer
    def get_min(self):
        data = self._buffer.get_window_values()
        if not data:
            return None
        return min(data)
    
    # Function to get the maximum value in the buffer
    # If the buffer is empty, it returns None
    # The maximum value is calculated from the values in the current window of the buffer
    def get_max(self):
        data = self._buffer.get_window_values()
        if not data:
            return None
        return max(data)
 
    # Function to get the range of values in the buffer
    # The range is calculated as the difference between the maximum and minimum values
    # If the buffer is empty, it returns None
    def get_range(self):
        min_val = self.get_min()
        max_val = self.get_max()
        if min_val is None or max_val is None:
            return None
        return max_val - min_val
    
    # Function to get the derivative of the values in the buffer
    # The derivative is calculated as the change in value over the change in time
    # If there are not enough values to calculate the derivative, it returns None
    # Returns the derivative of the values in the buffer
    def get_derivative(self):
        values, timestamps = self._buffer.get_window()
        if len(values) < 2 or len(timestamps) < 2:
            return None
        v1, v2 = values[-2], values[-1]
        t1, t2 = timestamps[-2], timestamps[-1]
        dt = t2 - t1
        if dt == 0:
            return None
        return (v2 - v1) / dt
    
   