# Transfer Learning — 전이 학습

## 학습 목표
- Feature Extraction과 Fine-tuning의 차이를 이해한다
- MobileNetV2로 이미지 분류기를 구현할 수 있다

## 1. Feature Extraction

사전 훈련된 가중치를 동결하고 마지막 분류 레이어만 훈련합니다.

```python
import tensorflow as tf

base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False  # 가중치 동결

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(10, activation='softmax')
])
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
```

## 2. Fine-tuning

상위 레이어 일부를 해동하여 작은 학습률로 재훈련합니다.

```python
# Feature Extraction으로 수렴 후
base_model.trainable = True
fine_tune_at = 100  # 100번째 레이어부터 훈련

for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-5),  # 낮은 학습률
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
```
