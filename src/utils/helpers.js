const calculateWorkHours = (
  checkIn,
  checkOut
) => {
  const totalHours =
    (checkOut - checkIn) /
    (1000 * 3600);

  const regularHours =
    Math.min(totalHours, 8);

  const overtime =
    Math.max(0, totalHours - 8);

  const status =
    totalHours >= 7
      ? "FULL_DAY"
      : totalHours >= 4
      ? "HALF_DAY"
      : "SHORT_DAY";

  return {
    totalHours: Number(
      totalHours.toFixed(2)
    ),

    regularHours: Number(
      regularHours.toFixed(2)
    ),

    overtime: Number(
      overtime.toFixed(2)
    ),

    status,
  };
};

const deductLeaveBalance = (
  user,
  type,
  days
) => {
  if (
    user.leaveBalance[type] >= days
  ) {
    user.leaveBalance[type] -= days;
    return true;
  }

  return false;
};

module.exports = {
  calculateWorkHours,
  deductLeaveBalance,
};