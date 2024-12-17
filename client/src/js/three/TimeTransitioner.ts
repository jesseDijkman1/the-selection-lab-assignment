class TimeTransitioner {
  private timeStamp: number | null;
  private deltaT: number;
  private timeElapsed: number;
  private multiplier: number;
  private paused: boolean;

  constructor(readonly duration: number) {
    this.timeStamp = null;
    this.deltaT = 0;
    this.timeElapsed = 0;
    this.multiplier = 1;

    this.paused = false;
  }

  pause() {
    this.paused = true;
  }

  play() {
    this.paused = false;
  }

  getTimeElapsed() {
    return this.timeElapsed;
  }

  update(timeStamp: number) {
    if (this.timeStamp !== null) {
      this.deltaT = (timeStamp - this.timeStamp) / 1000;

      if (this.paused && this.multiplier > 0) {
        this.multiplier -= this.deltaT;

        if (this.multiplier < 0) this.multiplier = 0;
      } else if (!this.paused && this.multiplier < 1) {
        this.multiplier += this.deltaT;

        if (this.multiplier > 1) this.multiplier = 1;
      }

      this.timeElapsed += this.deltaT * this.multiplier;
    }

    this.timeStamp = timeStamp;
  }
}

export default TimeTransitioner;
