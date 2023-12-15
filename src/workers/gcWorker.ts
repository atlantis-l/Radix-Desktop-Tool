setInterval(
  () => {
    gc && gc();
  },
  1000 * 60 * 60,
);
