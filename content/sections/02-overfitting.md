# Overfitting vs Underfitting

## 학습 목표
- 과적합/과소적합의 증상을 손실 곡선으로 진단할 수 있다
- 적절한 해결 전략을 선택할 수 있다

## 1. 진단: 손실 곡선 해석

```python
import matplotlib.pyplot as plt

history = model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=50)

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.legend()
plt.title('Loss Curves')
plt.show()
```

## 2. 과적합 (Overfitting)

**증상**: train loss ↓, val loss ↑ (diverge)

**해결책**:
- 데이터 증강 (→ Section 3)
- Dropout, L2 정규화 (→ Section 1)
- 모델 복잡도 축소

## 3. 과소적합 (Underfitting)

**증상**: train loss와 val loss 모두 높고 수렴하지 않음

**해결책**:
- 모델 복잡도 증가 (레이어/뉴런 수 늘리기)
- 학습률 조정
- 더 많은 에폭 훈련

## Early Stopping

```python
from tensorflow.keras.callbacks import EarlyStopping

callback = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
model.fit(X_train, y_train, callbacks=[callback], epochs=100)
```
