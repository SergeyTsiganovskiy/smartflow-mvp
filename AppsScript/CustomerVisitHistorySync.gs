function syncCustomerVisitHistoryFromCalendarCache() {
  const appointments =
    getCalendarCache();

  const now =
    new Date();

  appointments.forEach(function(item) {
    if (!item.calendar_event_id) {
      return;
    }

    if (!item.end_at) {
      return;
    }

    if (new Date(item.end_at) > now) {
      return;
    }

    const existingVisit =
      findCustomerVisitByCalendarEventId(
        item.calendar_event_id
      );

    if (existingVisit) {
      updateCustomerVisitHistory(
        existingVisit.visit_id,
        {
          customer_name:
            item.customer_name || '',

          service_id:
            item.service_id || '',

          service_name:
            item.service_name || '',

          provider_id:
            item.provider_id || '',

          provider_name:
            item.provider_name || '',

          location_id:
            item.location_id || '',

          location_name:
            item.location_name || '',

          start_at:
            item.start_at || '',

          end_at:
            item.end_at || '',

          status:
            item.status || '',

          customer_note:
            item.customer_note || '',

          synced_at:
            new Date()
        }
      );

      return;
    }

    createCustomerVisitHistory(item);
  });
}
