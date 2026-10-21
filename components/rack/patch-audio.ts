/**
 * The rack's voice: one Web Audio graph that mirrors the patch.
 * source (saw) → level (lowpass) → tone (VCA) → master → out, with one PULSE LFO fanned out to
 * cutoff, tremolo and vibrato. Everything starts silent and the AudioContext is only created
 * inside the shopper's click, so nothing ever plays on its own.
 */

export interface PatchState {
	/** current reaches the output */
	tone: boolean;
	/** the level module sits in the path */
	filtered: boolean;
	pulseDim: boolean;
	pulseTint: boolean;
	pulseTune: boolean;
}

export const QUIET: PatchState = {
	tone: false,
	filtered: false,
	pulseDim: false,
	pulseTint: false,
	pulseTune: false,
};

type Graph = {
	ctx: AudioContext;
	master: GainNode;
	vca: GainNode;
	filter: BiquadFilterNode;
	lfoCut: GainNode;
	lfoTrem: GainNode;
	lfoVib: GainNode;
};

function build(): Graph {
	const ctx = new AudioContext();
	const master = ctx.createGain();
	master.gain.value = 0;
	master.connect(ctx.destination);

	const vca = ctx.createGain();
	vca.gain.value = 0.7;
	vca.connect(master);

	const filter = ctx.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.value = 16000;
	filter.Q.value = 0.0001;
	filter.connect(vca);

	const osc = ctx.createOscillator();
	osc.type = "sawtooth";
	osc.frequency.value = 110;
	osc.connect(filter);
	osc.start();

	const lfo = ctx.createOscillator();
	lfo.type = "triangle";
	lfo.frequency.value = 0.55;

	const lfoCut = ctx.createGain();
	lfoCut.gain.value = 0;
	lfo.connect(lfoCut);
	lfoCut.connect(filter.frequency);

	const lfoTrem = ctx.createGain();
	lfoTrem.gain.value = 0;
	lfo.connect(lfoTrem);
	lfoTrem.connect(vca.gain);

	const lfoVib = ctx.createGain();
	lfoVib.gain.value = 0;
	lfo.connect(lfoVib);
	lfoVib.connect(osc.detune);

	lfo.start();
	return { ctx, master, vca, filter, lfoCut, lfoTrem, lfoVib };
}

export class PatchAudio {
	enabled = false;
	private graph: Graph | null = null;
	private state: PatchState = { ...QUIET };

	/** Toggle sound. Returns the new enabled state. */
	async toggle(): Promise<boolean> {
		if (!this.graph) {
			try {
				this.graph = build();
			} catch {
				return false;
			}
		}
		const { ctx } = this.graph;
		this.enabled = !this.enabled;
		try {
			if (this.enabled) await ctx.resume();
		} catch {
			/* resume can be denied; apply() keeps the master at 0 */
		}
		this.apply();
		if (!this.enabled) {
			window.setTimeout(() => {
				if (!this.enabled) void ctx.suspend();
			}, 350);
		}
		return this.enabled;
	}

	update(state: PatchState) {
		this.state = { ...state };
		this.apply();
	}

	dispose() {
		this.enabled = false;
		void this.graph?.ctx.close().catch(() => {});
		this.graph = null;
	}

	private apply() {
		const g = this.graph;
		if (!g) return;
		const s = this.state;
		const t = g.ctx.currentTime;
		const on = this.enabled && s.tone;
		g.master.gain.setTargetAtTime(on ? 0.12 : 0, t, on ? 0.12 : 0.08);
		g.filter.frequency.setTargetAtTime(s.filtered ? 640 : 16000, t, 0.12);
		g.filter.Q.setTargetAtTime(s.filtered ? 6 : 0.0001, t, 0.12);
		g.lfoCut.gain.setTargetAtTime(s.pulseDim ? 430 : 0, t, 0.15);
		g.lfoTrem.gain.setTargetAtTime(s.pulseTint ? 0.3 : 0, t, 0.15);
		g.lfoVib.gain.setTargetAtTime(s.pulseTune ? 30 : 0, t, 0.15);
	}
}
