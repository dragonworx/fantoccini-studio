<style lang="scss">
  .layout {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    border: 1px solid red;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Label from "../../gui/components/Label.svelte";
  import Form from "../../gui/components/Form.svelte";
  import TextField from "../../gui/components/TextField.svelte";
  import Window from "../../gui/components/Window.svelte";
  import app from "../application";

  export let isOpen: boolean = false;

  $: state = {
    title: "Untitled",
  };

  $: screenWidth = app.screenWidth;
  $: screenHeight = app.screenHeight;
  $: halfScreenWidth = Math.round(screenWidth / 2);
  $: halfScreenHeight = Math.round(screenHeight / 2);

  const dispatch = createEventDispatcher();

  const onClose = () => {
    dispatch("cancel");
  };
</script>

<main>
  <Window
    id="newProject"
    {isOpen}
    title="New Project"
    x={halfScreenWidth * 0.5}
    y={halfScreenHeight * 0.5}
    width={halfScreenWidth}
    height={halfScreenHeight}
    canMaximise={false}
    canMinimise={false}
    on:close={onClose}>
    <div class="layout">
      <Form labelSize={100} width={300}>
        <Label text="Title:" /><TextField bind:value={state.title} />
        <Label text="Title:" /><TextField />
      </Form>
    </div>
  </Window>
</main>
