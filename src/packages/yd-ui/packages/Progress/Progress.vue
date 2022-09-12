<style lang="postcss">
.yd-progress {
  position: relative;
  line-height: 1;

  &__text {
    font-size: 14px;
    color: var(--color-extra-light-black);
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 1;

    i {
      vertical-align: middle;
      display: block;
    }
  }
  &--circle {
    display: inline-block;

    .yd-progress__text {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      text-align: center;
      margin: 0;
      transform: translate(0, -50%);

      i {
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
  &--without-text {
    .yd-progress__text {
      display: none;
    }
    .yd-progress-bar {
      padding-right: 0;
      margin-right: 0;
      display: block;
    }
  }
  &--text-inside {
    .yd-progress-bar {
      padding-right: 0;
      margin-right: 0;
    }
  }
  &.is-success {
    .yd-progress-bar__inner {
      background-color: var(--color-success);
    }
    .yd-progress__text {
      color: var(--color-success);
    }
  }
  &.is-exception {
    .yd-progress-bar__inner {
      background-color: var(--color-danger);
    }
    .yd-progress__text {
      color: var(--color-danger);
    }
  }
}
.yd-progress-bar {
  padding-right: 50px;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  margin-right: -55px;
  box-sizing: border-box;

  &__outer {
    height: 6px;
    /* border-radius: 100px; */
    background-color: var(--color-light-gray);
    overflow: hidden;
    position: relative;
    vertical-align: middle;
  }
  &__inner {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    /* border-radius: 2px 0 0 2px; */
    background-color: var(--color-primary);
    text-align: right;
    /* border-radius: 100px; */
    line-height: 1;
    white-space: nowrap;

    @utils-vertical-center;
  }
  &__innerText {
    display: inline-block;
    vertical-align: middle;
    color: var(--color-white);
    font-size: 12px;
    margin: 0 5px;
  }
}

@keyframes progress {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 32px 0;
  }
}
</style>

<template>
  <div
    :class="[
      'yd-progress--' + type,
      status ? 'is-' + status : '',
      {
        'yd-progress--without-text': !showText,
        'yd-progress--text-inside': textInside,
      }
    ]"
    :aria-valuenow="percentage"
    class="yd-progress"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100">
    <div v-if="type === 'line'" class="yd-progress-bar">
      <div :style="{height: strokeWidth + 'px'}" class="yd-progress-bar__outer">
        <div :style="barStyle" class="yd-progress-bar__inner">
          <div v-if="showText && textInside" :style="{'line-height': strokeWidth + 'px'}" class="yd-progress-bar__innerText">{{ percentage }}%</div>
        </div>
      </div>
    </div>
    <div v-else :style="{height: width + 'px', width: width + 'px'}" class="yd-progress-circle">
      <svg viewBox="0 0 100 100">
        <path :d="trackPath" :stroke-width="relativeStrokeWidth" class="yd-progress-circle__track" stroke="#e5e9f2" fill="none"/>
        <path :d="trackPath" :stroke="stroke" :stroke-width="relativeStrokeWidth" :style="circlePathStyle" class="yd-progress-circle__path" stroke-linecap="round" fill="none"/>
      </svg>
    </div>
    <div v-if="showText && !textInside" :style="{fontSize: progressTextSize + 'px'}" class="yd-progress__text">
      <template v-if="!status">{{ percentage }}%</template>
      <i v-else :class="iconClass"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'YdProgress',
  props: {
    type: {
      type: String,
      default: 'line',
      validator: val => ['line', 'circle'].indexOf(val) > -1
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 && val <= 100
    },
    status: {
      type: String
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    barStyle() {
      const style = {}
      style.width = this.percentage + '%'
      style.backgroundColor = this.color
      return style
    },
    relativeStrokeWidth() {
      return (this.strokeWidth / this.width * 100).toFixed(1)
    },
    trackPath() {
      const radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10)

      return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`
    },
    perimeter() {
      const radius = 50 - parseFloat(this.relativeStrokeWidth) / 2
      return 2 * Math.PI * radius
    },
    circlePathStyle() {
      const perimeter = this.perimeter
      return {
        strokeDasharray: `${perimeter}px,${perimeter}px`,
        strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
        transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    },
    stroke() {
      let ret
      if (this.color) {
        ret = this.color
      } else {
        switch (this.status) {
          case 'success':
            ret = '#13ce66'
            break
          case 'exception':
            ret = '#ff4949'
            break
          default:
            ret = '#20a0ff'
        }
      }
      return ret
    },
    iconClass() {
      if (this.type === 'line') {
        return this.status === 'success' ? 'yd-icon-circle-check' : 'yd-icon-circle-close'
      } else {
        return this.status === 'success' ? 'yd-icon-check' : 'yd-icon-close'
      }
    },
    progressTextSize() {
      return this.type === 'line'
        ? 12 + this.strokeWidth * 0.4
        : this.width * 0.111111 + 2
    }
  }
}
</script>
