import { h, JSX } from "preact";
import { useRouter } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import SearchComponent from "../components/search.component";
import { doRequest } from "../services/http.service";
import { BookingRequest, BookingResponse } from "../types/booking";
import { DateTime } from "luxon";

export default function ResultsRoute(): JSX.Element {
  const [searchParams] = useRouter();
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const departureDate = DateTime.fromFormat(
      searchParams?.matches?.departureDate,
      "yyyy-MM-dd"
    ).toFormat("dd-MM-yyyy");
    const requestBody: BookingRequest = {
      bookingType: "holiday",
      location: searchParams?.matches?.location,
      departureDate: departureDate,
      duration: searchParams?.matches?.duration as unknown as number,
      gateway: "LHR",
      partyCompositions: [
        {
          adults: searchParams?.matches?.adults as unknown as number,
          childAges: [],
          infants: 0,
        },
      ],
    };

    doRequest("POST", "/cjs-search-api/search", requestBody).then(
      (response: unknown | BookingResponse) => {
        setHolidays(response.holidays);
        console.log(response.holidays);
      }
    );
  }, [searchParams]);

  return (
    <div>
      <section>
        <SearchComponent />
        {holidays.map((holiday, index) => (
            <div>
                <h1>Price Per Person: {holiday.pricePerPerson}</h1>
                <h1>Hotel Facilities: {holiday.hotel.name}</h1>
                <h1>Star Rating: {holiday.hotel.content.vRating}</h1>
            </div>
        ))}
      </section>
    </div>
  );
}
