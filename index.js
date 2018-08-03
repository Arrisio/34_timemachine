var TIMEOUT_IN_SECS = 3 * 60
var TEMPLATE = '<h1><span class="js-timer-minutes">00</span>:<span class="js-timer-seconds">00</span></h1>'
var MSG_TIMEOUT = 30

function padZero(number){
  return ("00" + String(number)).slice(-2);
}

class Timer{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  constructor(timeout_in_secs){
    this.initial_timeout_in_secs = timeout_in_secs
    this.reset()
  }
  getTimestampInSecs(){
    var timestampInMilliseconds = new Date().getTime()
    return Math.round(timestampInMilliseconds/1000)
  }
  start(){
    if (this.isRunning)
      return
    this.timestampOnStart = this.getTimestampInSecs()
    this.isRunning = true
  }
  stop(){
    if (!this.isRunning)
      return
    this.timeout_in_secs = this.calculateSecsLeft()
    this.timestampOnStart = null
    this.isRunning = false
  }
  reset(timeout_in_secs){
    this.isRunning = false
    this.timestampOnStart = null
    this.timeout_in_secs = this.initial_timeout_in_secs
  }
  calculateSecsLeft(){
    if (!this.isRunning)
      return this.timeout_in_secs
    var currentTimestamp = this.getTimestampInSecs()
    var secsGone = currentTimestamp - this.timestampOnStart
    return Math.max(this.timeout_in_secs - secsGone, 0)
  }
}

class TimerWidget{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  construct(){
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
  mount(rootTag){
    if (this.timerContainer)
      this.unmount()

    // adds HTML tag to current page
    this.timerContainer = document.createElement('div')

    this.timerContainer.setAttribute("style", "height: 100px; position: fixed; z-index: 2; top:20px; color: #4986a1")
    this.timerContainer.innerHTML = TEMPLATE

    rootTag.insertBefore(this.timerContainer, rootTag.firstChild)

    this.minutes_element = this.timerContainer.getElementsByClassName('js-timer-minutes')[0]
    this.seconds_element = this.timerContainer.getElementsByClassName('js-timer-seconds')[0]
  }
  update(secsLeft){
    var minutes = Math.floor(secsLeft / 60);
    var seconds = secsLeft - minutes * 60;

    this.minutes_element.innerHTML = padZero(minutes)
    this.seconds_element.innerHTML = padZero(seconds)
  }
  unmount(){
    if (!this.timerContainer)
      return
    this.timerContainer.remove()
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
}


class MessageDemonstrator {
    constructor(){
      this.counter = 0
      this.MESSAGES_LIST = [
    "Люблю я Работу, Зарплату люблю!\n" +
    "Все больше себя я на этом ловлю.\n" +
    "Люблю я и Босса; он - лучше других!\n" +
    "И Боссова Босса и всех остальных.",

    "Люблю я мой Офис, его размещение\n" +
    "А к отпуску чувствую я отвращение.\n" +
    "Люблю мою мебель, сырую и серую,\n" +
    "Бумажки, в которых как в Бога я верую!",

    "Люблю мое кресло в Ячейке без свету\n" +
    "И в мире предмета любимее нету!\n" +
    "Люблю я и равных мне по положению\n" +
    "Их хитрые взгляды, насмешки, глумления.",

    "Мой славный Дисплей и Компьютер я лично\n" +
    "Украдкой целую, хоть им безразлично ...\n" +
    "И каждую прогу опять и опять,\n" +
    "Я время от времени силюсь понять!!",

    "Я счастлив быть здесь; и пока не ослаб\n" +
    "Любимой работы счастливейший раб.\n" +
    "Я нормы и сроки работ обожаю,\n" +
    "Люблю совещанья, хоть там засыпаю.",

    "Люблю я Работу - скажу без затей;\n" +
    "И этих нарядных, всех в белом людей,\n" +
    "Пришедших сегодня меня навестить,\n" +
    "С желаньем куда-то меня поместить !!"
]
    }

    show_message(){
      window.alert(this.MESSAGES_LIST[this.counter])
      this.counter += 1
      if (this.counter >= this.MESSAGES_LIST.length){
        this.counter = 0
      }
    }
}

function main(){

  var timer = new Timer(TIMEOUT_IN_SECS)
  var timerWiget = new TimerWidget()
  var intervalId = null
  var messageDemonstrator = new MessageDemonstrator()

  timerWiget.mount(document.body)

  function handleIntervalTick(){
    var secsLeft = timer.calculateSecsLeft()
    if (secsLeft === 0) {
      messageDemonstrator.show_message()
      timer = new Timer(MSG_TIMEOUT);
      secsLeft = timer.calculateSecsLeft();
      timer.start();
    }
    timerWiget.update(secsLeft)

  }

  function handleVisibilityChange(){
    if (document.hidden) {
      timer.stop()
      clearInterval(intervalId)
      intervalId = null
    } else {
      timer.start()
      intervalId = intervalId || setInterval(handleIntervalTick, 300)
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  document.addEventListener("visibilitychange", handleVisibilityChange, false);
  handleVisibilityChange()
}

// initialize timer when page ready for presentation
window.addEventListener('load', main)

