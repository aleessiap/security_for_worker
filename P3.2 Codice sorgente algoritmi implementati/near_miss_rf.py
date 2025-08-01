import logging
import pandas as pd
import numpy as np

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, accuracy_score, f1_score, precision_score, recall_score, matthews_corrcoef
from sklearn.ensemble import RandomForestClassifier
 

import m2cgen as m2c


# Configurazione del logger per messaggi informativi
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
 
# Creazione di finestre temporali basate sul timestamp
def create_window_timestamp(data, win_size, step_size):
    windows = []
    start_time = data[0]['Timestamp']    
    end_time   = data[-1]['Timestamp']   
    # scorre fino a quando la finestra ci sta nel range
    while start_time + win_size <= end_time:
        # seleziona i record nella finestra corrente
        window = [r for r in data
                  if start_time <= r['Timestamp'] < start_time + win_size]
        if window:
            windows.append(window)        
        start_time += step_size          
    logger.info("Finestre create: %d", len(windows))
    return windows
 
# Calcolo di statistiche base (media, deviazione, max, min, range)
def basic_stats(s):
    return {
        'mean':  s.mean(),
        'std':   s.std(),
        'max':   s.max(),
        'min':   s.min(),
        'range': s.max() - s.min()
    }
 
# Calcolo statistiche
def calculate_statistics(df, col):
    stats = {}
    
    if col not in df:
        return stats
        
    base = basic_stats(df[col])
    stats.update({f"{col}_{k}": v for k, v in base.items()})
    
    # se ci sono almeno 2 record, calcola derivata
    if len(df) > 1:
        dt    = df['Timestamp'].iloc[-1] - df['Timestamp'].iloc[0]
        delta = df[col].iloc[-1] - df[col].iloc[0]
        stats[f"{col}_derivative"] = delta / dt if dt else 0
        
    return stats
 
# Estrazione delle feature da ciascuna finestra
def get_features(window):
    df_window = pd.DataFrame(window)  
 
    cols = [
        'GyroX','GyroY','GyroZ',
        'AccX','AccY','AccZ','AccMag',
        'AngX','AngY','AngZ','AngMag'
    ]
    features = {}
  
    for col in cols:
        features.update(calculate_statistics(df_window, col))
        
    return features
 
# Etichettatura delle finestre
def set_label(windows, major_thresh=0.5):
    labels = []
    
    for w in windows:
        dfw = pd.DataFrame(w)
        counts = dfw['Tag'].value_counts()
        
        # se la percentuale di -1 supera la soglia viene taggato come anomalia
        if counts.get(-1, 0) >= len(dfw) * major_thresh:
            labels.append(-1)
        else:
            labels.append(1)
    return labels
 
 
# Funzione per caricare e dividere il dataset
def load_and_split(path: str,
                   train_frac: float = 0.6,
                   seed: int = 42):  
    df = pd.read_csv(path)
    X = df.drop(columns='Tag') #feature
    y = df['Tag']              # targert
    
    # split: train + il resto
    X_train_all, X_temp, y_train_all, y_temp = train_test_split(
        X, y,
        test_size=1 - train_frac,
        stratify=y,
        random_state=seed
    )
    # secondo split: divisione del restante in validation e test
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp,
        test_size=0.5,
        stratify=y_temp,
        random_state=seed
    )
    # Log delle dimensioni
    logger.info("Split sizes → train_all: %d, val: %d, test: %d",
                len(X_train_all), len(X_val), len(X_test))
    
    # Reset degli indici
    return (
        X_train_all.reset_index(drop=True),
        X_val.reset_index(drop=True),
        X_test.reset_index(drop=True),
        y_train_all.reset_index(drop=True),
        y_val.reset_index(drop=True),
        y_test.reset_index(drop=True)
    )
 
#Funzione per fitting e trasformazione con StandardScaler
def fit_scaler(X_train_base: pd.DataFrame):   
    scaler = StandardScaler().fit(X_train_base)
    return scaler, lambda X: scaler.transform(X)
 
# Valutazione delle performance di un modello con visualizzazione della matrice di confusione
def evaluate(model, X_test, y_test, class_names=None, show_confusion_matrix=True):
 
    # Predizioni del modello
    predictions = model.predict(X_test)
    cm = confusion_matrix(y_test, predictions, labels=[-1, 1])
    
    # Safely get confusion matrix components
    tn, fp, fn, tp = 0, 0, 0, 0
    if cm.shape == (2, 2):
        tn, fp, fn, tp = cm.ravel()
 
    # Calcolo delle metriche
    metrics = {
        "Accuracy": accuracy_score(y_test, predictions) * 100,
        "F1 Score": f1_score(y_test, predictions, pos_label=-1, zero_division=0) * 100,
        "Precision": precision_score(y_test, predictions, pos_label=-1, zero_division=0) * 100,
        "Recall": recall_score(y_test, predictions, pos_label=-1, zero_division=0) * 100,
        "MCC": matthews_corrcoef(y_test, predictions)
    }
 
    # Stampa delle metriche
    for metric, value in metrics.items():
        if metric == "MCC":
            print(f"{metric}: {value:.4f}")
        else:
            print(f"{metric}: {value:.2f}%")
 
    # Visualizza la matrice di confusione
    if show_confusion_matrix:
        print("\nConfusion Matrix:")
        if class_names:
            print(f"{'':<10} {'Predicted':^15}")
            print(f"{'':<10} {class_names[0]:^7} {class_names[1]:^7}")
            print(f"{'True':<10} {'-'*15}")
            print(f"{class_names[0]:<10} {cm[0,0]:^7} {cm[0,1]:^7}")
            print(f"{class_names[1]:<10} {cm[1,0]:^7} {cm[1,1]:^7}")
        else:
            print(cm)
 
    return metrics

def save_for_micropython(rf_model, scaler):
    model_code = m2c.export_to_python(rf_model)
    with open("near_miss/rf_model.py", "w") as f:
        f.write(model_code)


    mean = scaler.mean_.tolist()
    std = scaler.scale_.tolist()

    # Salvali su file (opzionale, oppure copiali a mano)
    with open("near_miss/rf_scaler_values.py", "w") as f:
        f.write(f"mean = {mean}\n")
        f.write(f"std = {std}\n")

    print("Modello e scaler salvati per MicroPython.")
 
 
if __name__ == "__main__":
    # File di input e output
    file_input   = 'near_miss/Subject1_output.csv'  # file con dati grezzi
    file_output  = 'near_miss/Subject1_output2.csv' # file di destinazione
 
    df = pd.read_csv(file_input)
 
    # Calcolo delle magnitudini vettoriali
    arr_acc = df[['AccX','AccY','AccZ']].values
    arr_ang = df[['AngX','AngY','AngZ']].values
    df['AccMag'] = np.linalg.norm(arr_acc, axis=1)
    df['AngMag'] = np.linalg.norm(arr_ang, axis=1)
 
    # Parametri per la segmentazione in finestre
    WIN_SIZE     = 2000                    # lunghezza di ogni finestra
    OVERLAP      = 0.5                     # sovrapposizione del 50%
    MAJOR_THRESH = 0.5                     # soglia per anomalia
    STEP_SIZE    = int(WIN_SIZE * (1 - OVERLAP))  # passo di scorrimento
 
    data    = df.to_dict(orient='records')
    windows = create_window_timestamp(data, WIN_SIZE, STEP_SIZE)
 
    # Estrazione delle feature e assegnazione dei label
    features = [get_features(w) for w in windows]
    labels   = set_label(windows, major_thresh=MAJOR_THRESH)
    features_df = pd.DataFrame(features)
    features_df['Tag'] = labels
    features_df = features_df.dropna()
    features_df.to_csv(file_output, index=False)
 
 
    # Carico e split dei dati
    X_train_all, X_val, X_test, y_train_all, y_val, y_test = load_and_split(file_output)
 
    # Fitting dello scaler sui normali e trasformazione di tutti i set
    # Lo scaler viene fitto su X_train_all per la classificazione supervisionata
    scaler = StandardScaler().fit(X_train_all)
    transform = lambda X: scaler.transform(X)
 
    X_train_sup_s  = transform(X_train_all)
    X_val_s        = transform(X_val)
    X_test_s       = transform(X_test)
 
    
    # RandomForest iperparametri selezionati
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        class_weight='balanced',
        random_state=42
    )
 
    # Unisco train + validation scalati in un unico set per il training finale
    X_tr_full = np.vstack([X_train_sup_s, X_val_s])
    y_tr_full = pd.concat([y_train_all, y_val], ignore_index=True)
 
    logger.info("Fitting RandomForestClassifier with fixed hyperparameters")
    rf_model.fit(X_tr_full, y_tr_full)
 
    print(f"\n--- Test evaluation for RandomForestClassifier ---")
    metrics = evaluate(
        rf_model,
        X_test_s,
        y_test,
        class_names=['Anomalia', 'Normale'],
        show_confusion_matrix=True
    )

    save_for_micropython(rf_model, scaler)

