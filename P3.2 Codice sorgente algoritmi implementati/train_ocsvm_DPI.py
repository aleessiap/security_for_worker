import pandas as pd
import glob
import numpy as np 
import os
from sklearn.svm import OneClassSVM
import m2cgen as m2c
# Define the window sizes for rolling calculations
WINDOWS = ['5S']


def create_dataset(folder, filename):
    # Read the CSV file into a DataFrame
    data = pd.read_csv(
        folder + filename,
        header=0,
        names=["timestamp", "device_name", "rssi"], 
        )
    #data.dropna()
    print(data)
    #adapt timestamp to sign from moment of start
    data['timestamp'] = pd.to_datetime(data['timestamp'],unit='ns')
    new_t = []
    
    for t in data["timestamp"]:
        new_t.append(t - data["timestamp"][0])
        
    new_t = pd.TimedeltaIndex(data=new_t, unit='seconds', name='timestamp')
    
    # Pivot the DataFrame to have device names as columns
    data_by_nodes = pd.pivot_table(data=data, index=new_t, columns=['device_name'], values="rssi")
    data_by_nodes.index = pd.to_datetime(data_by_nodes.index, unit='ns')
    
    # Get the list of device names
    node_names = list(data_by_nodes.columns.values)

    # Initialize an output DataFrame
    output = pd.DataFrame()
    
    windows = WINDOWS

    # Select the first node for processing
    casco = '2-lvl-node-1'  
    node1=  data_by_nodes[casco]

    # Add raw RSSI data for the first node to output
    output['h_raw'] = node1
    for w in windows:
        # Calculate rolling statistics for the first node
        window = data_by_nodes[casco].rolling(w)
        count = window.count()
        # Add rolling statistics to output DataFrame
        output['h'+w+'_count'] = count
        output['h'+w+'_mean'] = (data_by_nodes[casco].rolling(w, closed='right').mean()).fillna(0).round(2)
        output['h'+w+'_variance'] = (output['h'+w+'_mean'].rolling(w, closed='right').var()).fillna(1000000).round(2)
        output['h'+w+'_std'] = (output['h'+w+'_mean'].rolling(w, closed='right').std()).fillna(1000000).round(2)

    # Remove the first node from the list of device names
    node_names.remove(casco)
    print(node_names)

    # If there are two nodes (there should be!)combine their data
    if len(node_names) ==2: 
        # first shoe
        node1=  data_by_nodes[node_names[0]]
        node1 = node1[node1.notna()]
        # second shoe
        node2 = data_by_nodes[node_names[1]]
        node2 = node2[node2.notna()]

        # Combine the two nodes' data
        output['s_raw'] = node1.combine_first(node2)
        
        for w in windows:
            # Calculate rolling statistics for both nodes
            count1 =  (data_by_nodes[node_names[0]].rolling(w)).count() 
            count2 = (data_by_nodes[node_names[1]].rolling(w)).count()
            
            output['s'+w+'_count']  = count1.combine(count2, min, 0)
            output['s'+w+'_count'].fillna(method="ffill")
            
            avg1 = (data_by_nodes[node_names[0]].rolling(w).mean()).round(2)
            avg2 = (data_by_nodes[node_names[1]].rolling(w).mean()).round(2)
            
            avg  = pd.concat([avg1, avg2]).groupby(level=0).mean().round(2).fillna(method="ffill")
            var = (avg.rolling(w, closed='right').var())
            std = (avg.rolling(w, closed='right').std())
            
            output['s'+w+'_mean'] = avg.fillna(0).round(2)
            output['s'+w+'_variance'] = var.fillna(1000000).round(2)
            output['s'+w+'_std'] = std.fillna(1000000).round(2)
    else:
        # If only one node is present, use its data
        #node1=  data_by_nodes[node_names[0]]
        #node1 = node1[node1.notna()]
        count = data_by_nodes[node_names[0]].rolling(w).count()
        output['s_raw'] = node1
        output['s'+w+'_count'] = count
        output['s'+w+'_count'].fillna(method="ffill")

        output['s'+w+'_mean'] =  (data_by_nodes[node_names[0]].rolling(w).mean()).round(2)
        output['s'+w+'_variance'] = (output['s'+w+'_mean'].rolling(w, closed='right').var()).fillna(1000000).round(2)
        output['s'+w+'_std'] = (output['s'+w+'_mean'].rolling(w, closed='right').std()).fillna(1000000).round(2)


        
    # Remove the first 5 seconds of data to avoid initial noise
    N = len(output[output.index < pd.to_datetime('1970-01-01 00:00:05')])

    output = output.drop(output.index[:N])  
   
    output.to_csv(folder + 'w_' + filename )
    
def classic(train):
    # Read the training data
    columns_name =["H_raw","H5S_count","H5S_mean", "H5S_variance", "H5S_std",  "S_raw", "S5S_count", "S5S_mean", "S5S_variance", "S5S_std"]
    train = pd.read_csv(train, header=0,sep=',', names=columns_name)
    print(train)
    X_train = train[["H5S_count","H5S_mean", "H5S_variance", "H5S_std",  "S5S_count", "S5S_mean", "S5S_variance", "S5S_std"]]

    # Train an One-Class SVM model
    model = OneClassSVM(kernel='rbf',  nu= 0.1, gamma = 'scale').fit(X_train)
   
    # Export the model to Python code
    code = m2c.export_to_python(model)
    print(code)
    with open(folder + 'ocsvm.py', 'w') as fd:
        fd.write(code)

folder = 'DPI/'
filename='Subject_1.csv'

create_dataset(folder, filename)    
classic(folder + 'w_' + filename)