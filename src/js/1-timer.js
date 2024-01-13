import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let countdownInterval;

datetimePicker.flatpickr({
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date,
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    if (selectedDate <= now) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});

startButton.disabled = true;

function updateTimerDisplay(time) {
  daysValue.textContent = addLeadingZero(time.days);
  hoursValue.textContent = addLeadingZero(time.hours);
  minutesValue.textContent = addLeadingZero(time.minutes);
  secondsValue.textContent = addLeadingZero(time.seconds);
}

function startCountdown(targetDate) {
  clearInterval(countdownInterval);
  datetimePicker.disabled = true

  countdownInterval = setInterval(() => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay(convertMs(0));
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished!',
        position: 'topRight'
      });
      startButton.disabled = false;
    } else {
      updateTimerDisplay(convertMs(difference));
    }
  }, 1000);
}

startButton.addEventListener('click', () => {
  const selectedDate = new Date(datetimePicker._flatpickr.selectedDates[0]);
  startButton.disabled = true;
  startCountdown(selectedDate);
});

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}