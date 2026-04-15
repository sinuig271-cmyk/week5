# Regularization — 과적합 억제 기법

## 학습 목표
- L1/L2 정규화의 원리와 차이를 설명할 수 있다
- Dropout과 Batch Normalization을 코드로 적용할 수 있다

## 1. L1 / L2 Regularization

가중치가 너무 커지는 것을 페널티로 억제합니다.

```python
from tensorflow.keras import regularizers
from tensorflow.keras.layers import Dense

# L2 정규화 (weight decay)
layer = Dense(64, kernel_regularizer=regularizers.l2(0.01))

# L1 정규화 (희소성 유도)
layer = Dense(64, kernel_regularizer=regularizers.l1(0.01))
```

## 2. Dropout

훈련 시 뉴런을 랜덤하게 비활성화하여 앙상블 효과를 냅니다.

```python
from tensorflow.keras.layers import Dropout

model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))  # 50% 뉴런을 랜덤 비활성화
```

## 3. Batch Normalization

미니배치 단위로 활성화값을 정규화합니다. 학습을 안정화하고 더 높은 학습률 사용을 가능하게 합니다.

```python
from tensorflow.keras.layers import BatchNormalization

model.add(Dense(128))
model.add(BatchNormalization())
model.add(Activation('relu'))
```

## 핵심 요약

| 기법 | 목적 | 주요 효과 |
|------|------|-----------|
| L2 | 가중치 크기 제한 | 일반화 성능 향상 |
| Dropout | 랜덤 비활성화 | 과적합 방지 |
| Batch Norm | 활성화값 정규화 | 학습 안정화 |
