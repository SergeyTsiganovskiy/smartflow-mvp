function getCachedAppointmentsByDate(dateValue) {
    const targetDate =
        normalizeDateForStorage(dateValue);

    const result =
        getCalendarCache().filter(function(item) {
            const cacheDate =
                normalizeDateForStorage(item.cache_date);


            const status =
                String(item.status || '').toLowerCase();

            return cacheDate === targetDate &&
                status === 'confirmed';
        });


    result.sort(function(a, b) {
        return new Date(a.start_at) - new Date(b.start_at);
    });

    return result;
}

function getCachedAppointmentsByProvider(providerId) {
    const now =
        new Date();

    const result =
        getCalendarCache().filter(function(item) {
            const status =
                String(item.status || '').toLowerCase();


            return String(item.provider_id) === String(providerId) &&
                status === 'confirmed' &&
                new Date(item.start_at) >= now;
        });


    result.sort(function(a, b) {
        return new Date(a.start_at) - new Date(b.start_at);
    });

    return result;
}

function getCustomerVisitHistory(phone) {
    const phoneKey =
        getPhoneSearchKey(phone);

    const result =
        getCalendarCache().filter(function(item) {
            const status =
                String(item.status || '').toLowerCase();


            return getPhoneSearchKey(item.phone) === phoneKey &&
                status === 'confirmed';
        });


    result.sort(function(a, b) {
        return new Date(b.start_at) - new Date(a.start_at);
    });

    return result;
}

function getNextCustomerAppointment(phone) {
  const phoneKey =
    getPhoneSearchKey(phone);

  const now =
    new Date();

  const result =
    getCalendarCache().filter(function(item) {
      const itemPhoneKey =
        getPhoneSearchKey(item.phone);

      const status =
        String(item.status || '').toLowerCase();

      if (itemPhoneKey !== phoneKey) {
        return false;
      }

      if (status !== 'confirmed') {
        return false;
      }

      if (new Date(item.start_at) < now) {
        return false;
      }

      return true;
    });

  result.sort(function(a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  return result[0] || null;
}
