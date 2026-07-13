function syncCustomerProfiles() {
  const profiles = getCustomerProfiles();

  const profileByPhoneKey = {};

  profiles.forEach(function (profile) {
    const phoneKey = String(profile.phone_key || '');

    if (!phoneKey) {
      return;
    }

    profileByPhoneKey[phoneKey] = profile;
  });

  const customers = getCustomers();

  const customerByPhoneKey = {};

  customers.forEach(function (customer) {
    const phoneKey = getPhoneSearchKey(customer.phone);

    if (!phoneKey) {
      return;
    }

    customerByPhoneKey[phoneKey] = customer;
  });

  const statsByPhoneKey = buildCustomerVisitStatsFromVisitHistory();

  Object.keys(statsByPhoneKey).forEach(function (phoneKey) {
    const stats = statsByPhoneKey[phoneKey];

    const customer = customerByPhoneKey[phoneKey] || {};

    const existingProfile = profileByPhoneKey[phoneKey];

    if (!existingProfile) {
      const createdProfile = createCustomerProfile({
        phone: stats.phone || customer.phone || '',

        name: stats.customer_name || customer.name || '',

        telegram_id: customer.telegram_id || '',

        language: customer.language || '',

        last_visit_at: stats.last_visit_at || '',

        visit_count: stats.visit_count || 0,

        active: true,

        synced_at: new Date()
      });

      if (createdProfile) {
        profileByPhoneKey[phoneKey] = createdProfile;
      }

      return;
    }

    updateCustomerProfile(existingProfile.profile_id, {
      telegram_id: customer.telegram_id || existingProfile.telegram_id || '',

      language: customer.language || existingProfile.language || '',

      last_visit_at: stats.last_visit_at || '',

      visit_count: stats.visit_count || 0,

      synced_at: new Date()
    });
  });
}

function buildCustomerVisitStatsFromVisitHistory() {
  const visits = getCustomerVisitHistoryRows();

  const result = {};

  visits.forEach(function (visit) {
    const phoneKey = String(visit.phone_key || '');

    if (!phoneKey) {
      return;
    }

    if (!result[phoneKey]) {
      result[phoneKey] = {
        phone: visit.phone || '',

        customer_name: visit.customer_name || '',

        visit_count: 0,

        last_visit_at: ''
      };
    }

    result[phoneKey].visit_count++;

    if (!result[phoneKey].last_visit_at || new Date(visit.start_at) > new Date(result[phoneKey].last_visit_at)) {
      result[phoneKey].last_visit_at = visit.start_at;

      result[phoneKey].customer_name = visit.customer_name || result[phoneKey].customer_name;
    }
  });

  return result;
}
