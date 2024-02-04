<script>
  export let size = 20;
</script>

<div class="spinner_wrapper" style="--spinner-size: {size}px;">
    <div class="spinner_spinner">
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
        <div class="spinner_bar"></div>
    </div>
</div>

<style>
  .spinner_spinner, .spinner_wrapper {
    height: var(--spinner-size, 20px);
    width: var(--spinner-size, 20px);
  }
  
  .spinner_spinner {
    position: relative;
    top: 50%;
    left: 50%;
  }

  .spinner_bar {
    animation: spinner_spin 1.2s linear infinite;
    background: #000;
    border-radius: 10px;
    height: 8%;
    left: -10%;
    position: absolute;
    top: -3.9%;
    width: 24%;
  }

  .spinner_bar:first-child {
    animation-delay: -1.2s;
    transform: rotate(0.0001deg) translate(146%);
  }

  .spinner_bar:nth-child(2) {
    animation-delay: -1.1s;
    transform: rotate(30deg) translate(146%);
  }

  .spinner_bar:nth-child(3) {
    animation-delay: -1s;
    transform: rotate(60deg) translate(146%);
  }

  .spinner_bar:nth-child(4) {
    animation-delay: -0.9s;
    transform: rotate(90deg) translate(146%);
  }

  .spinner_bar:nth-child(5) {
    animation-delay: -0.8s;
    transform: rotate(120deg) translate(146%);
  }

  .spinner_bar:nth-child(6) {
    animation-delay: -0.7s;
    transform: rotate(150deg) translate(146%);
  }

  .spinner_bar:nth-child(7) {
    animation-delay: -0.6s;
    transform: rotate(180deg) translate(146%);
  }

  .spinner_bar:nth-child(8) {
    animation-delay: -0.5s;
    transform: rotate(210deg) translate(146%);
  }

  .spinner_bar:nth-child(9) {
    animation-delay: -0.4s;
    transform: rotate(240deg) translate(146%);
  }

  .spinner_bar:nth-child(10) {
    animation-delay: -0.3s;
    transform: rotate(270deg) translate(146%);
  }

  .spinner_bar:nth-child(11) {
    animation-delay: -0.2s;
    transform: rotate(300deg) translate(146%);
  }

  .spinner_bar:nth-child(12) {
    animation-delay: -0.1s;
    transform: rotate(330deg) translate(146%);
  }

  @keyframes spinner_spin {
    0% {
      opacity: 1;
    }

    to {
      opacity: 0.15;
    }
  }
</style>