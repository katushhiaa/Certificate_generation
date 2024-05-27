export const titleRules = [(v) => !!v || "Назва заходу обов'язкова"];

export const durationRules = [
  (v) => !!v || "Тривалість обов'язкова",
  (v) => {
    const allowedWords = [
      "годин",
      "година",
      "години",
      "день",
      "дні",
      "тиждень",
      "тижні",
    ];
    return (
      allowedWords.some((word) => v.includes(word)) ||
      "Тривалість має містити одне з наступних слів: годин, година, години, день, дні, тиждень, тижні"
    );
  },
];

export const teacherSurnameRules = [
  (v) => !!v || "Прізвище викладача обов'язкове",
];
export const dateOfGivingRules = [(v) => !!v || "Дата видачі обов'язкова"];
