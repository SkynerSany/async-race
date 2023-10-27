const CONTROL_PANEL_TEMPLATE = `<div class="control-panel">
                                  <form class="control-panel__form" id="create-form">
                                    <input type="text" minlength="3" required>
                                    <input type="color" value="#ffffff">
                                    <button class="button btn-create">
                                        <span class="button__label">CREATE</span>
                                        <span class="button__icon">
                                            <span></span>
                                        </span>
                                    </button>
                                  </form>
                                  <form class="control-panel__form" id="update-form">
                                    <input type="text" minlength="3" required>
                                    <input type="color" value="#ffffff">
                                    <button class="button btn-update">
                                        <span class="button__label">UPDATE</span>
                                        <span class="button__icon">
                                            <span></span>
                                        </span>
                                    </button>
                                  </form>
                                  <div class="control-panel__btn-container">
                                    <button class="button" id="btn-race">
                                        <span class="button__label">RACE</span>
                                        <span class="button__icon">
                                            <span></span>
                                        </span>
                                    </button>
                                    <button class="button" id="btn-reset" disabled>
                                        <span class="button__label">RESET</span>
                                        <span class="button__icon">
                                            <span></span>
                                        </span>
                                    </button>
                                    <button class="button" id="btn-generate">
                                        <span class="button__label">GENERATE CARS</span>
                                        <span class="button__icon">
                                            <span></span>
                                        </span>
                                    </button>
                                  </div>
                                </div>`;

export default CONTROL_PANEL_TEMPLATE;