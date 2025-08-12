import javax.swing.JFrame;
import java.awt.Toolkit;
import java.util.ArrayList;
public class Main extends JFrame
{
	Model model;
	Controller controller;
	View view;

	public Main()
	{
		// Instantiate the three main objects
		this.model = new Model();
		this.view = new View(model);
		this.controller = new Controller(model, view);

		// Set some window properties
		this.setTitle("Turtle Attack!");
		this.setSize(500, 500);
		this.setFocusable(true);
		this.getContentPane().add(view);
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setVisible(true);
		this.addKeyListener(controller);
	}

	public void run()
	{
		// Main loop
		while(true)
		{
			this.controller.update();
			this.model.update();
			this.view.repaint(); // Indirectly calls View.paintComponent
			Toolkit.getDefaultToolkit().sync(); // Updates screen

			// Go to sleep for a brief moment
			try
			{
				Thread.sleep(25);
			} catch(Exception e) {
				e.printStackTrace();
				System.exit(1);
			}
		}
	}
		public static final String[] MapItemTypes = {
		"chair",
		"lamp",
		"mushroom",
		"outhouse",
		"pillar",
		"pond",
		"rock",
		"statue",
		"tree",
		"turtle",
	};

	public static void main(String[] args)
	{
		Main m = new Main();
		m.run();
	}
}
