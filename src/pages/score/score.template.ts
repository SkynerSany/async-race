const SCORE_TEMPLATE = `<div class="container score-container">
                          <h2 class="score-title">Score ( <span class="score__count">0</span> )</h2>
                          <p class="wrapper current-page">Page: <span class="score__current-page">1</span></p>
                          <div class="wrapper score-table">
                            <div class="score-table__row score-table__row-header">
                              <p>№</p>
                              <p>Car</p>
                              <p>Name</p>
                              <p id="sort-wins" data-sort="wins-ASK">Wins</p>
                              <p id="sort-time" data-sort="time-ASK">Time</p>
                            </div>
                            <div class="score-table__row-body"></div>
                          </div>
                        </div>`;

export default SCORE_TEMPLATE;