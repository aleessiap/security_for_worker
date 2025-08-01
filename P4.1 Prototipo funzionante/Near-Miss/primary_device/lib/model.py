import math
from lib.rf_model import score 
from lib.rf_scaler_values import mean, std

def scale_input(x, mean, std):
    scaled = []
    for i in range(len(x)):
        if std[i] != 0:
            scaled.append((x[i] - mean[i]) / std[i])
        else:
            scaled.append(0.0)
    return scaled


def predict(input):
    x_scaled = scale_input(input, mean, std)

    pred = score(x_scaled)
    print("predict: Predicted value:", pred)
    if pred[0] > pred[1]:
        return 1
    else:
        return 0
