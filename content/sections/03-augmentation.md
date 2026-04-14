# Data Augmentation — 데이터 증강

## 학습 목표
- 이미지 데이터 증강 기법을 이해하고 Keras로 구현할 수 있다

## 1. 왜 증강이 필요한가

적은 데이터로 다양한 변형을 학습시켜 일반화 성능을 높입니다.

## 2. Keras ImageDataGenerator

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
)

# 훈련 데이터에 증강 적용
train_generator = datagen.flow(X_train, y_train, batch_size=32)
model.fit(train_generator, epochs=20)
```

## 3. tf.data 파이프라인 방식

```python
import tensorflow as tf

def augment(image, label):
    image = tf.image.random_flip_left_right(image)
    image = tf.image.random_brightness(image, max_delta=0.1)
    image = tf.image.random_contrast(image, 0.8, 1.2)
    return image, label

dataset = tf.data.Dataset.from_tensor_slices((X_train, y_train))
dataset = dataset.map(augment).batch(32).prefetch(tf.data.AUTOTUNE)
```
